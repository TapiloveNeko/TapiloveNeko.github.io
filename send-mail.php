<?php
// フォームが送信された場合の処理
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // フォームデータの取得と文字エンコーディング設定
    mb_language("Japanese");
    mb_internal_encoding("UTF-8");
    
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['contact'];

    // 送信先設定
    $to = "tapiloveneko@gmail.com";
    $subject = "ウェブサイトからのお問い合わせ";

    // メール本文の作成
    $body = "お名前: " . $name . "\n";
    $body .= "メールアドレス: " . $email . "\n";
    $body .= "内容:\n" . $message . "\n";

    // ヘッダー設定
    $headers = "From: " . $email . "\n";
    $headers .= "Reply-To: " . $email . "\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // メール送信
    if(mail($to, $subject, $body, $headers)) {
        // 送信成功時
        header("Location: send-completely.html");
        exit;
    } else {
        // 送信失敗時
        echo "メールの送信に失敗しました。もう一度お試しください。";
    }
}
?>