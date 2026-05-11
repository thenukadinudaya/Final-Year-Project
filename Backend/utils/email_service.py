import smtplib
from email.message import EmailMessage
import os

# Using Ethereal Email for development/testing
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.ethereal.email")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "lucile.murray53@ethereal.email")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "F12qgJg8M1qR36aJz7")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@careerguidance.com")

def send_verification_email(to_email, user_name, token):
    """
    Sends a verification email to the newly registered user.
    Uses Ethereal Email for safe development testing.
    """
    verification_link = f"http://localhost:5173/verify-email/{token}"
    
    msg = EmailMessage()
    msg['Subject'] = 'Please verify your email address'
    msg['From'] = FROM_EMAIL
    msg['To'] = to_email
    
    # Create HTML email content
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
            .content {{ padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }}
            .btn {{ display: inline-block; background-color: #2563eb; color: white !important; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }}
            .footer {{ margin-top: 20px; font-size: 12px; color: #666; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Welcome to Career Guidance AI</h2>
            </div>
            <div class="content">
                <p>Hello {user_name},</p>
                <p>Thank you for registering! To complete your setup and ensure the security of your account, please verify your email address.</p>
                <p>Click the button below to verify your account:</p>
                <div style="text-align: center;">
                    <a href="{verification_link}" class="btn">Verify Email Address</a>
                </div>
                <p style="margin-top: 30px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #2563eb;">{verification_link}</p>
                <p>If you did not create an account, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2026 Career Guidance AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    msg.set_content("Please enable HTML to view this email.")
    msg.add_alternative(html_content, subtype='html')

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
            print(f"DEBUG: Verification email sent to {to_email}")
            print(f"DEBUG: You can view Ethereal emails at: https://ethereal.email/login")
            print(f"DEBUG: Ethereal Credentials -> U: {SMTP_USERNAME} | P: {SMTP_PASSWORD}")
            return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
