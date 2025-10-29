<?php
// Apsaugos headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Leidžiama tik POST užklausa']);
    exit;
}

// Rate limiting - simple file-based
$ip = $_SERVER['REMOTE_ADDR'];
$rate_limit_file = sys_get_temp_dir() . '/form_rate_' . md5($ip);
if (file_exists($rate_limit_file)) {
    $last_submission = file_get_contents($rate_limit_file);
    if (time() - $last_submission < 60) { // 1 minute cooldown
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Per daug užklausų. Pabandykite po 1 minutės.']);
        exit;
    }
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$not_robot = isset($_POST['not_robot']) ? $_POST['not_robot'] : '';
$honeypot = isset($_POST['_honey']) ? $_POST['_honey'] : '';

// Validation
$errors = [];

// Check honeypot (bot protection)
if (!empty($honeypot)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Aptikta įtartina veikla']);
    exit;
}

// Validate name
if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Vardas turi būti bent 2 simbolių ilgio';
}

// Validate email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Neteisingas el. pašto adresas';
}

// Validate message
if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Žinutė turi būti bent 10 simbolių ilgio';
}

// Validate checkbox
if (empty($not_robot)) {
    $errors[] = 'Prašome patvirtinti, kad nesate robotas';
}

// If validation fails
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Sanitize inputs
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Email settings
$to = 'tavogeneratorius@gmail.com';
$subject = 'Nauja žinutė iš tavogeneratorius.lt';

// Email body (HTML format)
$email_body = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #5e42a6, #b74e91); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #5e42a6; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🔔 Nauja Kontaktinė Žinutė</h2>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Vardas:</span><br>
                ' . $name . '
            </div>
            <div class="field">
                <span class="label">El. paštas:</span><br>
                <a href="mailto:' . $email . '">' . $email . '</a>
            </div>
            <div class="field">
                <span class="label">Žinutė:</span><br>
                ' . nl2br($message) . '
            </div>
            <div class="field">
                <span class="label">IP adresas:</span><br>
                ' . $ip . '
            </div>
            <div class="field">
                <span class="label">Data ir laikas:</span><br>
                ' . date('Y-m-d H:i:s') . '
            </div>
        </div>
        <div class="footer">
            <p>Ši žinutė gauta per kontaktų formą svetainėje <a href="https://tavogeneratorius.lt">tavogeneratorius.lt</a></p>
        </div>
    </div>
</body>
</html>
';

// Email headers
$headers = array(
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Tavo Generatorius <noreply@tavogeneratorius.lt>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
);

// Send email
$mail_sent = mail($to, $subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Save rate limit timestamp
    file_put_contents($rate_limit_file, time());
    
    // Log successful submission (optional)
    $log_entry = date('Y-m-d H:i:s') . " - Success: $name ($email) from $ip\n";
    error_log($log_entry, 3, sys_get_temp_dir() . '/contact_form.log');
    
    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => '✅ Ačiū! Jūsų žinutė sėkmingai išsiųsta. Susisieksime su jumis artimiausiu metu.'
    ]);
} else {
    // Log error
    $log_entry = date('Y-m-d H:i:s') . " - Error: Failed to send email from $name ($email)\n";
    error_log($log_entry, 3, sys_get_temp_dir() . '/contact_form.log');
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => '❌ Atsiprašome, įvyko techninė klaida. Prašome susisiekti tiesiogiai: +370 607 94868 arba tavogeneratorius@gmail.com'
    ]);
}
?>

