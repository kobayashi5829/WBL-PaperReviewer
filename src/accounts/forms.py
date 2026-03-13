from django import forms
from allauth.account.forms import SignupForm, LoginForm

class CustomSignupForm(SignupForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['email'].label = "Eメールアドレス"
        self.fields['username'].label = "ユーザー名"
        self.fields['password1'].label = "パスワード"
        self.fields['password2'].label = "パスワード（確認）"

        self.fields['email'].widget.attrs['placeholder'] = "email"
        self.fields['username'].widget.attrs['placeholder'] = "username"
        self.fields['password1'].widget.attrs['placeholder'] = "password"
        self.fields['password2'].widget.attrs['placeholder'] = "password"

        self.fields['email'].error_messages = {
            'required': 'Eメールアドレスを入力してください。',
            'invalid': '正しいEメールアドレスを入力してください',
            'unique': 'このEメールアドレスは既に使用されています。',
        }

        self.fields['username'].error_messages = {
            'required': 'ユーザー名を入力してください。',
            'invalid': '使用できない文字が含まれています。',
            'unique': 'このユーザー名は既に使用されています。',
        }

        self.fields['password1'].error_messages = {
            'required': 'パスワードを入力してください。',
        }

        self.fields['password2'].error_messages = {
            'required': '確認用パスワードを入力してください。',
            'password_mismatch': 'パスワードが同一ではありません。',
        }

class CustomLoginForm(LoginForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['login'].label = "Eメールアドレス or ユーザー名"
        self.fields['password'].label = "パスワード"
        
        self.fields['login'].widget.attrs['placeholder'] = "email or username"
        self.fields['password'].widget.attrs['placeholder'] = "password"