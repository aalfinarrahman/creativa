<?php
// Main API Handler
// Usage: /api/index.php?table=participants (GET, POST, PUT, DELETE)

require_once 'database.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST') {
    $override = null;
    if (isset($_POST['_method'])) {
        $override = $_POST['_method'];
    } elseif (isset($_GET['_method'])) {
        $override = $_GET['_method'];
    }
    if ($override) {
        $override = strtoupper(trim((string)$override));
        if ($override === 'PUT' || $override === 'DELETE') {
            $method = $override;
        }
    }
}
$pdo = getDbConnection();

try {
    $action = isset($_GET['action']) ? $_GET['action'] : null;
    if ($action) {
        switch ($action) {
            case 'ping':
                echo json_encode(['ok' => true, 'apiVersion' => '2026-03-14']);
                exit;
            case 'login':
                if ($method !== 'POST') {
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed']);
                    exit;
                }
                handleLogin($pdo);
                exit;
            case 'login_any':
                if ($method !== 'POST') {
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed']);
                    exit;
                }
                handleLoginAny($pdo);
                exit;
            case 'admin_login':
                if ($method !== 'POST') {
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed']);
                    exit;
                }
                handleAdminLogin($pdo);
                exit;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                exit;
        }
    }

    // Get Table Name
    $table = isset($_GET['table']) ? $_GET['table'] : null;
    $allowedTables = ['participants', 'programs', 'gallery', 'articles', 'documents', 'teams', 'broadcasts', 'settings'];

    if (!$table || !in_array($table, $allowedTables)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid or missing table parameter']);
        exit;
    }

    switch ($method) {
        case 'GET':
            handleGet($pdo, $table);
            break;
        case 'POST':
            handlePost($pdo, $table);
            break;
        case 'PUT':
            handlePut($pdo, $table);
            break;
        case 'DELETE':
            handleDelete($pdo, $table);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// --- Handler Functions ---

function normalizeEmailLoose($value) {
    $value = (string)$value;
    $value = strtolower(trim($value));
    $value = preg_replace('/\s+/u', '', $value);
    return $value;
}

function parseJsonLoose($value) {
    if ($value === null) return null;
    if (is_array($value)) return $value;
    if (is_object($value)) return (array)$value;
    $raw = trim((string)$value);
    if ($raw === '') return null;
    $parsed = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) return null;
    return is_array($parsed) ? $parsed : null;
}

function safeString($value) {
    if ($value === null) return '';
    if (is_bool($value)) return $value ? 'Ya' : 'Tidak';
    if (is_scalar($value)) return trim((string)$value);
    return '';
}

function safeHtml($value) {
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function splitCsvList($value) {
    $raw = trim((string)$value);
    if ($raw === '') return [];
    $parts = preg_split('/\s*,\s*/', $raw);
    $out = [];
    foreach ($parts as $p) {
        $p = trim((string)$p);
        if ($p !== '') $out[] = $p;
    }
    return $out;
}

function sendMailLoose($to, $subject, $htmlBody, $textBody = '') {
    $to = trim((string)$to);
    if ($to === '') return false;

    $fromEmail = defined('NOTIFY_FROM_EMAIL') ? trim((string)NOTIFY_FROM_EMAIL) : '';
    $fromName = defined('NOTIFY_FROM_NAME') ? trim((string)NOTIFY_FROM_NAME) : '';
    if ($fromEmail === '') {
        $host = isset($_SERVER['HTTP_HOST']) ? (string)$_SERVER['HTTP_HOST'] : 'localhost';
        $host = preg_replace('/^www\./i', '', $host);
        $fromEmail = 'no-reply@' . $host;
    }
    if ($fromName === '') {
        $fromName = 'LPK Website';
    }
    $encodedFromName = function_exists('mb_encode_mimeheader') ? mb_encode_mimeheader($fromName) : $fromName;

    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . $encodedFromName . ' <' . $fromEmail . '>';
    $headers[] = 'Reply-To: ' . $fromEmail;
    $headersStr = implode("\r\n", $headers);

    $subject = trim((string)$subject);
    if ($subject === '') $subject = 'Pendaftaran Baru';

    $ok = @mail($to, $subject, $htmlBody, $headersStr);
    if ($ok) return true;

    if ($textBody !== '') {
        $plainHeaders = [];
        $plainHeaders[] = 'MIME-Version: 1.0';
        $plainHeaders[] = 'Content-Type: text/plain; charset=UTF-8';
        $plainHeaders[] = 'From: ' . $encodedFromName . ' <' . $fromEmail . '>';
        $plainHeaders[] = 'Reply-To: ' . $fromEmail;
        $plainHeadersStr = implode("\r\n", $plainHeaders);
        return (bool)@mail($to, $subject, $textBody, $plainHeadersStr);
    }
    return false;
}

function postJsonLoose($url, $payload) {
    $url = trim((string)$url);
    if ($url === '') return false;
    $json = json_encode($payload, JSON_UNESCAPED_UNICODE);
    if ($json === false) return false;

    $options = [
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n" . "Accept: application/json\r\n",
            'content' => $json,
            'timeout' => 6,
        ],
    ];
    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);
    return $result !== false;
}

function buildParticipantEmail($participant) {
    $details = parseJsonLoose($participant['details'] ?? null) ?: [];

    $name = safeString($participant['name'] ?? '');
    $program = safeString($participant['program'] ?? ($details['programMinat'] ?? ''));
    $matchingJob = safeString($participant['matchingJob'] ?? ($details['matchingJob'] ?? ''));
    $email = safeString($participant['email'] ?? ($details['email'] ?? ''));
    $phone = safeString($participant['phone'] ?? ($details['noWhatsapp'] ?? ($details['phone'] ?? '')));
    $noKtp = safeString($participant['noKtp'] ?? ($details['noKtp'] ?? ''));
    $date = safeString($participant['date'] ?? '');
    $status = safeString($participant['status'] ?? '');
    $remarks = safeString($participant['remarks'] ?? '');

    $summaryRows = [
        ['Nama', $name],
        ['Program', $program],
        ['Matching Job', $matchingJob],
        ['Tanggal Daftar', $date],
        ['Status', $status],
        ['Email', $email],
        ['No WhatsApp', $phone],
        ['No KTP', $noKtp],
    ];

    $moreRows = [
        ['Usia', safeString($details['usia'] ?? '')],
        ['Kota Domisili', safeString($details['kotaDomisili'] ?? '')],
        ['Pendidikan', safeString($details['pendidikan'] ?? '')],
        ['Jurusan', safeString($details['jurusan'] ?? '')],
        ['Status Pekerjaan', safeString($details['statusPekerjaan'] ?? '')],
        ['Pengalaman Kerja (Indonesia)', safeString($details['pengalamanKerjaIndonesia'] ?? '')],
        ['Posisi Pengalaman Kerja', safeString($details['posisiPengalamanKerja'] ?? '')],
        ['Kemampuan Bahasa Jepang', safeString($details['kemampuanBahasa'] ?? '')],
        ['Rencana ke Jepang', safeString($details['rencanaKeJepang'] ?? '')],
        ['Relasi di Jepang', safeString($details['relasiDiJepang'] ?? '')],
        ['Pengalaman Luar Negeri', safeString($details['pengalamanLuarNegeri'] ?? '')],
        ['Pengalaman Ilegal/Deportasi', safeString($details['pengalamanIlegal'] ?? '')],
        ['Lokasi Tinggal', safeString($details['lokasiTinggal'] ?? '')],
        ['Instagram', safeString($details['instagram'] ?? '')],
    ];

    $table = function($rows) {
        $out = '<table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#e5e7eb;width:100%;">';
        foreach ($rows as $r) {
            $label = safeHtml($r[0]);
            $value = safeHtml($r[1] === '' ? '-' : $r[1]);
            $out .= '<tr><td style="background:#f9fafb;font-weight:600;width:220px;">' . $label . '</td><td>' . $value . '</td></tr>';
        }
        $out .= '</table>';
        return $out;
    };

    $subjectBits = [];
    if ($name !== '') $subjectBits[] = $name;
    if ($program !== '') $subjectBits[] = $program;
    $subject = 'Pendaftar Baru: ' . implode(' - ', $subjectBits);

    $html = '<div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827;">';
    $html .= '<h2 style="margin:0 0 12px 0;">Pendaftaran Baru Masuk</h2>';
    $html .= '<p style="margin:0 0 16px 0;">Ada pendaftar baru melalui website. Berikut ringkasannya:</p>';
    $html .= $table($summaryRows);
    $html .= '<h3 style="margin:18px 0 10px 0;">Data Tambahan</h3>';
    $html .= $table($moreRows);
    if ($remarks !== '') {
        $html .= '<h3 style="margin:18px 0 10px 0;">Remarks</h3>';
        $html .= '<div style="white-space:pre-wrap;border:1px solid #e5e7eb;background:#f9fafb;padding:10px;border-radius:6px;">' . safeHtml($remarks) . '</div>';
    }
    $html .= '<h3 style="margin:18px 0 10px 0;">Raw Details (JSON)</h3>';
    $html .= '<pre style="white-space:pre-wrap;border:1px solid #e5e7eb;background:#0b1020;color:#e5e7eb;padding:12px;border-radius:6px;overflow:auto;">' . safeHtml(json_encode($details, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) . '</pre>';
    $html .= '</div>';

    $waText = "Pendaftar baru:\n";
    if ($name !== '') $waText .= "- Nama: {$name}\n";
    if ($program !== '') $waText .= "- Program: {$program}\n";
    if ($matchingJob !== '') $waText .= "- Matching Job: {$matchingJob}\n";
    if ($phone !== '') $waText .= "- WA: {$phone}\n";
    if ($email !== '') $waText .= "- Email: {$email}\n";
    if ($date !== '') $waText .= "- Tgl: {$date}\n";

    return ['subject' => $subject, 'html' => $html, 'waText' => trim($waText)];
}

function sendRegistrationNotifications($participant) {
    $pack = buildParticipantEmail($participant);

    $emails = splitCsvList(defined('ADMIN_NOTIFY_EMAILS') ? ADMIN_NOTIFY_EMAILS : '');
    foreach ($emails as $to) {
        @sendMailLoose($to, $pack['subject'], $pack['html']);
    }

    $webhookUrl = defined('ADMIN_WHATSAPP_WEBHOOK_URL') ? trim((string)ADMIN_WHATSAPP_WEBHOOK_URL) : '';
    if ($webhookUrl !== '') {
        $toList = splitCsvList(defined('ADMIN_WHATSAPP_TO') ? ADMIN_WHATSAPP_TO : '');
        if (empty($toList)) $toList = [''];
        foreach ($toList as $to) {
            @postJsonLoose($webhookUrl, [
                'channel' => 'whatsapp',
                'to' => $to,
                'message' => $pack['waText'],
                'participantId' => $participant['id'] ?? null,
                'participant' => [
                    'name' => $participant['name'] ?? null,
                    'program' => $participant['program'] ?? null,
                    'email' => $participant['email'] ?? null,
                    'phone' => $participant['phone'] ?? null,
                    'date' => $participant['date'] ?? null,
                ],
            ]);
        }
    }
}

function handleLogin($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (empty($input)) {
        throw new Exception('No data provided');
    }

    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = isset($input['password']) ? (string)$input['password'] : '';

    if ($email === '' || $password === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Email dan password wajib diisi']);
        exit;
    }

    $stmt = $pdo->prepare("SHOW COLUMNS FROM `participants` LIKE 'password_hash'");
    $stmt->execute();
    $hasPasswordHash = (bool)$stmt->fetch();
    if (!$hasPasswordHash) {
        http_response_code(500);
        echo json_encode(['error' => 'Kolom password_hash belum ada. Jalankan migrasi database.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, name, email, program, status, date, password_hash FROM `participants` WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) ORDER BY id DESC LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user) {
        $normalizedEmail = normalizeEmailLoose($email);
        $stmt = $pdo->query("SELECT id, name, email, program, status, date, password_hash FROM `participants` ORDER BY id DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            if (normalizeEmailLoose($row['email'] ?? '') === $normalizedEmail) {
                $user = $row;
                break;
            }
        }
    }

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Email atau password salah']);
        exit;
    }

    if (empty($user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Password belum diatur admin']);
        exit;
    }

    $storedHash = is_string($user['password_hash']) ? trim($user['password_hash']) : (string)$user['password_hash'];
    $passwordInfo = password_get_info($storedHash);
    $isHashed = isset($passwordInfo['algo']) && (int)$passwordInfo['algo'] !== 0;
    $plainPassword = (string)$password;
    $isValid = $isHashed ? password_verify($plainPassword, $storedHash) : hash_equals($storedHash, trim($plainPassword));
    if (!$isValid) {
        http_response_code(401);
        echo json_encode(['error' => 'Email atau password salah']);
        exit;
    }
    if (!$isHashed) {
        $newHash = password_hash($plainPassword, PASSWORD_DEFAULT);
        $update = $pdo->prepare("UPDATE `participants` SET password_hash = ? WHERE id = ?");
        $update->execute([$newHash, $user['id']]);
    }

    echo json_encode([
        'role' => 'siswa',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'program' => $user['program'],
            'status' => $user['status'],
            'date' => $user['date'],
        ]
    ]);
}

function handleAdminLogin($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (empty($input)) {
        throw new Exception('No data provided');
    }

    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = isset($input['password']) ? (string)$input['password'] : '';

    if ($email === '' || $password === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Email dan password wajib diisi']);
        exit;
    }

    $stmt = $pdo->prepare("SHOW TABLES LIKE 'admins'");
    $stmt->execute();
    $hasAdminsTable = (bool)$stmt->fetch();
    if (!$hasAdminsTable) {
        http_response_code(500);
        echo json_encode(['error' => 'Tabel admins belum ada. Jalankan migrasi database.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM `admins` WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) ORDER BY id DESC LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user) {
        $normalizedEmail = normalizeEmailLoose($email);
        $stmt = $pdo->query("SELECT id, name, email, password_hash FROM `admins` ORDER BY id DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            if (normalizeEmailLoose($row['email'] ?? '') === $normalizedEmail) {
                $user = $row;
                break;
            }
        }
    }

    if (!$user || empty($user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Email atau password salah']);
        exit;
    }

    $storedHash = is_string($user['password_hash']) ? trim($user['password_hash']) : (string)$user['password_hash'];
    $passwordInfo = password_get_info($storedHash);
    $isHashed = isset($passwordInfo['algo']) && (int)$passwordInfo['algo'] !== 0;
    $plainPassword = (string)$password;
    $isValid = $isHashed ? password_verify($plainPassword, $storedHash) : hash_equals($storedHash, trim($plainPassword));
    if (!$isValid) {
        http_response_code(401);
        echo json_encode(['error' => 'Email atau password salah']);
        exit;
    }
    if (!$isHashed) {
        $newHash = password_hash($plainPassword, PASSWORD_DEFAULT);
        $update = $pdo->prepare("UPDATE `admins` SET password_hash = ? WHERE id = ?");
        $update->execute([$newHash, $user['id']]);
    }

    echo json_encode([
        'role' => 'admin',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
        ]
    ]);
}

function handleLoginAny($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (empty($input)) {
        throw new Exception('No data provided');
    }

    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = isset($input['password']) ? (string)$input['password'] : '';

    if ($email === '' || $password === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Email dan password wajib diisi']);
        exit;
    }

    $stmt = $pdo->prepare("SHOW TABLES LIKE 'admins'");
    $stmt->execute();
    $hasAdminsTable = (bool)$stmt->fetch();

    if ($hasAdminsTable) {
        $stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM `admins` WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) ORDER BY id DESC LIMIT 1");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();
        if (!$admin) {
            $normalizedEmail = normalizeEmailLoose($email);
            $stmt = $pdo->query("SELECT id, name, email, password_hash FROM `admins` ORDER BY id DESC");
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                if (normalizeEmailLoose($row['email'] ?? '') === $normalizedEmail) {
                    $admin = $row;
                    break;
                }
            }
        }

        if ($admin) {
            if (empty($admin['password_hash'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Email atau password salah']);
                exit;
            }

            $storedHash = is_string($admin['password_hash']) ? trim($admin['password_hash']) : (string)$admin['password_hash'];
            $passwordInfo = password_get_info($storedHash);
            $isHashed = isset($passwordInfo['algo']) && (int)$passwordInfo['algo'] !== 0;
            $plainPassword = (string)$password;
            $isValid = $isHashed ? password_verify($plainPassword, $storedHash) : hash_equals($storedHash, trim($plainPassword));
            if (!$isValid) {
                http_response_code(401);
                echo json_encode(['error' => 'Email atau password salah']);
                exit;
            }
            if (!$isHashed) {
                $newHash = password_hash($plainPassword, PASSWORD_DEFAULT);
                $update = $pdo->prepare("UPDATE `admins` SET password_hash = ? WHERE id = ?");
                $update->execute([$newHash, $admin['id']]);
            }

            echo json_encode([
                'role' => 'admin',
                'user' => [
                    'id' => $admin['id'],
                    'name' => $admin['name'],
                    'email' => $admin['email'],
                ]
            ]);
            exit;
        }
    }

    handleLogin($pdo);
}

function handleGet($pdo, $table) {
    // Specific sorting for teams
    $orderBy = 'created_at DESC';
    if ($table === 'teams') {
        $orderBy = 'sort_order ASC';
    }
    if ($table === 'programs') {
        $orderBy = 'sort_order ASC, created_at DESC';
    }

    $stmt = $pdo->prepare("SELECT * FROM `$table` ORDER BY $orderBy");
    $stmt->execute();
    $data = $stmt->fetchAll();
    echo json_encode($data);
}

function handlePost($pdo, $table) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        // Try $_POST if JSON body is empty (e.g. form-data, though we expect JSON)
        $input = $_POST;
    }

    $uploadedUrls = [];
    if (!empty($_FILES)) {
        $publicDir = realpath(__DIR__ . '/..');
        if (!$publicDir) {
            throw new Exception('Upload directory not available');
        }

        $uploadSubdir = $table === 'participants' ? 'participants' : $table;
        $uploadsBaseDir = $publicDir . '/uploads';
        if (!is_dir($uploadsBaseDir)) {
            @mkdir($uploadsBaseDir, 0755, true);
        }
        if (!is_dir($uploadsBaseDir)) {
            throw new Exception('Folder uploads tidak tersedia (gagal membuat folder).');
        }
        if (!is_writable($uploadsBaseDir)) {
            throw new Exception('Folder uploads tidak bisa ditulis. Periksa permission hosting.');
        }
        $uploadDir = $publicDir . '/uploads/' . $uploadSubdir;
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }
        if (!is_dir($uploadDir)) {
            throw new Exception('Folder upload target tidak tersedia (gagal membuat folder).');
        }
        if (!is_writable($uploadDir)) {
            throw new Exception('Folder upload target tidak bisa ditulis. Periksa permission hosting.');
        }

        foreach ($_FILES as $key => $file) {
            if (!isset($file['error'])) {
                throw new Exception('Upload gagal: file error tidak diketahui');
            }
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $message = 'Upload gagal.';
                switch ($file['error']) {
                    case UPLOAD_ERR_INI_SIZE:
                    case UPLOAD_ERR_FORM_SIZE:
                        $message = 'Ukuran file terlalu besar.';
                        break;
                    case UPLOAD_ERR_PARTIAL:
                        $message = 'Upload terputus. Coba ulang.';
                        break;
                    case UPLOAD_ERR_NO_FILE:
                        $message = 'Tidak ada file yang dipilih.';
                        break;
                    case UPLOAD_ERR_NO_TMP_DIR:
                        $message = 'Folder temporary upload tidak tersedia di server.';
                        break;
                    case UPLOAD_ERR_CANT_WRITE:
                        $message = 'Server gagal menulis file upload (permission).';
                        break;
                    case UPLOAD_ERR_EXTENSION:
                        $message = 'Upload diblokir oleh ekstensi server.';
                        break;
                    default:
                        $message = 'Upload gagal (kode error: ' . $file['error'] . ').';
                        break;
                }
                throw new Exception($message);
            }

            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $extension = preg_replace('/[^a-zA-Z0-9]/', '', $extension);
            $extensionLower = strtolower($extension);
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
            if ($extensionLower !== '' && !in_array($extensionLower, $allowedExtensions, true)) {
                throw new Exception('File type not allowed');
            }
            $filename = uniqid($key . '_', true) . ($extension ? ('.' . $extension) : '');
            $targetPath = $uploadDir . '/' . $filename;

            if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                throw new Exception('Failed to save uploaded file');
            }

            $url = '/uploads/' . $uploadSubdir . '/' . $filename;
            $uploadedUrls[$key] = $url;
            if ($table === 'programs' && ($key === 'programImage' || $key === 'image')) {
                $input['image'] = $url;
            } elseif ($table === 'gallery' && $key === 'image') {
                $input['image'] = $url;
            } elseif ($table === 'articles' && $key === 'image') {
                $input['image'] = $url;
            } else {
                $input[$key . 'Url'] = $url;
            }
        }
    }

    if (empty($input)) {
        throw new Exception('No data provided');
    }

    // Remove 'id' and 'created_at' if present (let DB handle them)
    unset($input['id']);
    unset($input['created_at']);

    if ($table === 'participants' && isset($input['password'])) {
        $plainPassword = trim((string)$input['password']);
        unset($input['password']);
        if ($plainPassword !== '') {
            $input['password_hash'] = password_hash($plainPassword, PASSWORD_DEFAULT);
        }
    }

    if ($table === 'programs' && isset($input['contentBlocks'])) {
        $payload = json_decode((string)$input['contentBlocks'], true);
        $summary = '';
        $blocks = [];
        if (is_array($payload)) {
            if (isset($payload['summary'])) {
                $summary = is_string($payload['summary']) ? $payload['summary'] : '';
            }
            $candidateBlocks = isset($payload['blocks']) && is_array($payload['blocks']) ? $payload['blocks'] : (array)$payload;
            foreach ($candidateBlocks as $block) {
                if (!is_array($block)) continue;
                $title = isset($block['title']) && is_string($block['title']) ? trim($block['title']) : '';
                $text = isset($block['text']) && is_string($block['text']) ? trim($block['text']) : '';
                $imageUrl = isset($block['imageUrl']) && is_string($block['imageUrl']) ? trim($block['imageUrl']) : '';
                $fit = isset($block['fit']) && is_string($block['fit']) ? trim($block['fit']) : '';
                $posX = isset($block['posX']) ? $block['posX'] : null;
                $posY = isset($block['posY']) ? $block['posY'] : null;
                $imageKey = isset($block['imageKey']) && is_string($block['imageKey']) ? trim($block['imageKey']) : '';
                if ($imageKey !== '' && isset($uploadedUrls[$imageKey])) {
                    $imageUrl = $uploadedUrls[$imageKey];
                }
                $normalized = [
                    'title' => $title,
                    'text' => $text,
                ];
                if ($imageUrl !== '') {
                    $normalized['imageUrl'] = $imageUrl;
                }
                if ($fit === 'cover' || $fit === 'contain') {
                    $normalized['fit'] = $fit;
                }
                if (is_numeric($posX)) {
                    $x = (float)$posX;
                    if ($x < 0) $x = 0;
                    if ($x > 100) $x = 100;
                    $normalized['posX'] = $x;
                }
                if (is_numeric($posY)) {
                    $y = (float)$posY;
                    if ($y < 0) $y = 0;
                    if ($y > 100) $y = 100;
                    $normalized['posY'] = $y;
                }
                $blocks[] = $normalized;
            }
        }
        if ($summary === '' && empty($blocks) && isset($input['title']) && is_string($input['title'])) {
            $summary = trim($input['title']);
        }
        $input['description'] = json_encode([
            '_type' => 'programContent',
            'summary' => $summary,
            'blocks' => $blocks,
        ], JSON_UNESCAPED_UNICODE);
        unset($input['contentBlocks']);
    }

    $stmt = $pdo->prepare("SHOW COLUMNS FROM `$table`");
    $stmt->execute();
    $columnsInTable = array_map(function($row) { return $row['Field']; }, $stmt->fetchAll());
    $columnsInTableMap = array_fill_keys($columnsInTable, true);
    $input = array_filter(
        $input,
        function ($value, $key) use ($columnsInTableMap) {
            return isset($columnsInTableMap[$key]);
        },
        ARRAY_FILTER_USE_BOTH
    );

    if (empty($input)) {
        throw new Exception('No valid fields to insert');
    }

    if ($table === 'settings') {
        $existing = $pdo->query("SELECT id FROM `settings` ORDER BY created_at DESC, id DESC LIMIT 1")->fetch();
        if ($existing && isset($existing['id'])) {
            $setClause = [];
            foreach ($input as $key => $value) {
                $setClause[] = "`$key` = :$key";
            }
            $sql = "UPDATE `settings` SET " . implode(', ', $setClause) . " WHERE id = :_id";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':_id', $existing['id']);
            foreach ($input as $key => $value) {
                if (is_array($value)) {
                    $value = json_encode($value, JSON_UNESCAPED_UNICODE);
                }
                $stmt->bindValue(":$key", $value);
            }
            $stmt->execute();

            $stmt = $pdo->prepare("SELECT * FROM `settings` WHERE id = ?");
            $stmt->execute([$existing['id']]);
            echo json_encode($stmt->fetch());
            return;
        }
    }

    $columns = array_keys($input);
    $quotedColumns = array_map(function($col) { return "`$col`"; }, $columns);
    $placeholders = array_map(function($col) { return ":$col"; }, $columns);
    
    $sql = "INSERT INTO `$table` (" . implode(', ', $quotedColumns) . ") VALUES (" . implode(', ', $placeholders) . ")";
    
    $stmt = $pdo->prepare($sql);
    
    foreach ($input as $key => $value) {
        if (is_array($value)) {
            $value = json_encode($value, JSON_UNESCAPED_UNICODE);
        }
        $stmt->bindValue(":$key", $value);
    }
    
    $stmt->execute();
    $id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);
    $inserted = $stmt->fetch();

    if ($table === 'participants') {
        $status = isset($inserted['status']) ? trim((string)$inserted['status']) : '';
        if ($status === 'Baru') {
            try {
                sendRegistrationNotifications($inserted);
            } catch (Exception $e) {
            }
        }
    }

    echo json_encode($inserted);
}

function handlePut($pdo, $table) {
    // For PUT, we need an ID. 
    // Usually passed as ?table=xyz&id=1 OR in the body.
    // Let's assume ID is in the query param or body.
    
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }
    $id = isset($_GET['id']) ? $_GET['id'] : (isset($input['id']) ? $input['id'] : null);

    if (!$id) {
        throw new Exception('ID is required for update');
    }

    $uploadedUrls = [];
    if (!empty($_FILES)) {
        $publicDir = realpath(__DIR__ . '/..');
        if (!$publicDir) {
            throw new Exception('Upload directory not available');
        }

        $uploadSubdir = $table === 'participants' ? 'participants' : $table;
        $uploadsBaseDir = $publicDir . '/uploads';
        if (!is_dir($uploadsBaseDir)) {
            @mkdir($uploadsBaseDir, 0755, true);
        }
        if (!is_dir($uploadsBaseDir)) {
            throw new Exception('Folder uploads tidak tersedia (gagal membuat folder).');
        }
        if (!is_writable($uploadsBaseDir)) {
            throw new Exception('Folder uploads tidak bisa ditulis. Periksa permission hosting.');
        }
        $uploadDir = $publicDir . '/uploads/' . $uploadSubdir;
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }
        if (!is_dir($uploadDir)) {
            throw new Exception('Folder upload target tidak tersedia (gagal membuat folder).');
        }
        if (!is_writable($uploadDir)) {
            throw new Exception('Folder upload target tidak bisa ditulis. Periksa permission hosting.');
        }

        foreach ($_FILES as $key => $file) {
            if (!isset($file['error'])) {
                throw new Exception('Upload gagal: file error tidak diketahui');
            }
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $message = 'Upload gagal.';
                switch ($file['error']) {
                    case UPLOAD_ERR_INI_SIZE:
                    case UPLOAD_ERR_FORM_SIZE:
                        $message = 'Ukuran file terlalu besar.';
                        break;
                    case UPLOAD_ERR_PARTIAL:
                        $message = 'Upload terputus. Coba ulang.';
                        break;
                    case UPLOAD_ERR_NO_FILE:
                        $message = 'Tidak ada file yang dipilih.';
                        break;
                    case UPLOAD_ERR_NO_TMP_DIR:
                        $message = 'Folder temporary upload tidak tersedia di server.';
                        break;
                    case UPLOAD_ERR_CANT_WRITE:
                        $message = 'Server gagal menulis file upload (permission).';
                        break;
                    case UPLOAD_ERR_EXTENSION:
                        $message = 'Upload diblokir oleh ekstensi server.';
                        break;
                    default:
                        $message = 'Upload gagal (kode error: ' . $file['error'] . ').';
                        break;
                }
                throw new Exception($message);
            }

            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $extension = preg_replace('/[^a-zA-Z0-9]/', '', $extension);
            $extensionLower = strtolower($extension);
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
            if ($extensionLower !== '' && !in_array($extensionLower, $allowedExtensions, true)) {
                throw new Exception('File type not allowed');
            }
            $filename = uniqid($key . '_', true) . ($extension ? ('.' . $extension) : '');
            $targetPath = $uploadDir . '/' . $filename;

            if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                throw new Exception('Failed to save uploaded file');
            }

            $url = '/uploads/' . $uploadSubdir . '/' . $filename;
            $uploadedUrls[$key] = $url;
            if ($table === 'programs' && ($key === 'programImage' || $key === 'image')) {
                $input['image'] = $url;
            } elseif ($table === 'gallery' && $key === 'image') {
                $input['image'] = $url;
            } elseif ($table === 'articles' && $key === 'image') {
                $input['image'] = $url;
            } else {
                $input[$key . 'Url'] = $url;
            }
        }
    }

    // Remove 'id' and 'created_at' from update data
    unset($input['id']);
    unset($input['created_at']);

    if ($table === 'participants' && isset($input['password'])) {
        $plainPassword = trim((string)$input['password']);
        unset($input['password']);
        if ($plainPassword !== '') {
            $input['password_hash'] = password_hash($plainPassword, PASSWORD_DEFAULT);
        }
    }

    if ($table === 'programs' && isset($input['contentBlocks'])) {
        $payload = json_decode((string)$input['contentBlocks'], true);
        $summary = '';
        $blocks = [];
        if (is_array($payload)) {
            if (isset($payload['summary'])) {
                $summary = is_string($payload['summary']) ? $payload['summary'] : '';
            }
            $candidateBlocks = isset($payload['blocks']) && is_array($payload['blocks']) ? $payload['blocks'] : (array)$payload;
            foreach ($candidateBlocks as $block) {
                if (!is_array($block)) continue;
                $title = isset($block['title']) && is_string($block['title']) ? trim($block['title']) : '';
                $text = isset($block['text']) && is_string($block['text']) ? trim($block['text']) : '';
                $imageUrl = isset($block['imageUrl']) && is_string($block['imageUrl']) ? trim($block['imageUrl']) : '';
                $fit = isset($block['fit']) && is_string($block['fit']) ? trim($block['fit']) : '';
                $posX = isset($block['posX']) ? $block['posX'] : null;
                $posY = isset($block['posY']) ? $block['posY'] : null;
                $imageKey = isset($block['imageKey']) && is_string($block['imageKey']) ? trim($block['imageKey']) : '';
                if ($imageKey !== '' && isset($uploadedUrls[$imageKey])) {
                    $imageUrl = $uploadedUrls[$imageKey];
                }
                $normalized = [
                    'title' => $title,
                    'text' => $text,
                ];
                if ($imageUrl !== '') {
                    $normalized['imageUrl'] = $imageUrl;
                }
                if ($fit === 'cover' || $fit === 'contain') {
                    $normalized['fit'] = $fit;
                }
                if (is_numeric($posX)) {
                    $x = (float)$posX;
                    if ($x < 0) $x = 0;
                    if ($x > 100) $x = 100;
                    $normalized['posX'] = $x;
                }
                if (is_numeric($posY)) {
                    $y = (float)$posY;
                    if ($y < 0) $y = 0;
                    if ($y > 100) $y = 100;
                    $normalized['posY'] = $y;
                }
                $blocks[] = $normalized;
            }
        }
        if ($summary === '' && empty($blocks) && isset($input['title']) && is_string($input['title'])) {
            $summary = trim($input['title']);
        }
        $input['description'] = json_encode([
            '_type' => 'programContent',
            'summary' => $summary,
            'blocks' => $blocks,
        ], JSON_UNESCAPED_UNICODE);
        unset($input['contentBlocks']);
    }

    $stmt = $pdo->prepare("SHOW COLUMNS FROM `$table`");
    $stmt->execute();
    $columnsInTable = array_map(function($row) { return $row['Field']; }, $stmt->fetchAll());
    $columnsInTableMap = array_fill_keys($columnsInTable, true);
    $input = array_filter(
        $input,
        function ($value, $key) use ($columnsInTableMap) {
            return isset($columnsInTableMap[$key]);
        },
        ARRAY_FILTER_USE_BOTH
    );

    if (empty($input)) {
        throw new Exception('No update data provided');
    }

    $setClause = [];
    foreach ($input as $key => $value) {
        $setClause[] = "`$key` = :$key";
    }
    
    $sql = "UPDATE `$table` SET " . implode(', ', $setClause) . " WHERE id = :_id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':_id', $id);
    
    foreach ($input as $key => $value) {
        if (is_array($value)) {
            $value = json_encode($value, JSON_UNESCAPED_UNICODE);
        }
        $stmt->bindValue(":$key", $value);
    }
    
    $stmt->execute();
    
    // Return the updated item
    $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode($stmt->fetch());
}

function handleDelete($pdo, $table) {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$id) {
        // Maybe in body?
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($input['id']) ? $input['id'] : null;
    }

    if (!$id) {
        throw new Exception('ID is required for delete');
    }

    $stmt = $pdo->prepare("DELETE FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'id' => $id]);
}
?>
