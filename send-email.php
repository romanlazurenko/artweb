<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Set UTF-8 encoding
mb_internal_encoding('UTF-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON data from request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
$missingFields = [];
if (empty($data['full-name'])) {
    $missingFields[] = 'full-name';
}
if (empty($data['email'])) {
    $missingFields[] = 'email';
}
if (empty($data['consent']) || $data['consent'] !== true) {
    $missingFields[] = 'consent';
}

if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'error' => 'Missing required fields: ' . implode(', ', $missingFields),
        'missing_fields' => $missingFields
    ]);
    exit;
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email format']);
    exit;
}

// Sanitize input data
$fullName = htmlspecialchars(strip_tags($data['full-name']), ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = !empty($data['phone']) ? htmlspecialchars(strip_tags($data['phone']), ENT_QUOTES, 'UTF-8') : 'Not provided';

// ============================================
// EMAIL CONFIGURATION
// ============================================
// IMPORTANT: Change this to your receiving email
$to = 'studioartwebstudio@gmail.com';

// IMPORTANT: Change this to your actual domain (must match your hosting domain)
$fromDomain = 'studioartweb.net';
$fromEmail = 'contact@' . $fromDomain;
$fromName = 'ArtWeb Contact Form';

$subject = 'New Contact Form Submission - ArtWeb';

// Email body
$emailBody = "New contact form submission from ArtWeb website.\n\n";
$emailBody .= "Details:\n";
$emailBody .= "==========================================\n\n";
$emailBody .= "Full Name: $fullName\n";
$emailBody .= "Email: $email\n";
$emailBody .= "Phone: $phone\n\n";
$emailBody .= "==========================================\n";
$emailBody .= "This email was automatically generated from the ArtWeb contact form.\n";
$emailBody .= "The user has agreed to the processing of their personal data.";

// Email headers - optimized for deliverability
$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "From: $fromName <$fromEmail>";
$headers[] = "Reply-To: $fullName <$email>";
$headers[] = "Return-Path: <$fromEmail>";
$headers[] = "X-Mailer: PHP/" . phpversion();
$headers[] = "X-Priority: 3";
$headers[] = "X-Originating-IP: " . $_SERVER['REMOTE_ADDR'];

$headersString = implode("\r\n", $headers);

// Encode subject with UTF-8
if (function_exists('mb_encode_mimeheader')) {
    $encodedSubject = mb_encode_mimeheader($subject, 'UTF-8', 'Q');
} else {
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

// Send email with additional parameters for better deliverability
$additionalParams = "-f$fromEmail";
$mailSent = mail($to, $encodedSubject, $emailBody, $headersString, $additionalParams);

if ($mailSent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email. Please try again later.']);
}
?>
