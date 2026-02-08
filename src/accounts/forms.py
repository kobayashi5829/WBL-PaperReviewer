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

class CustomLoginForm(LoginForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['login'].label = "Eメールアドレス or ユーザー名"
        self.fields['password'].label = "パスワード"
        
        self.fields['login'].widget.attrs['placeholder'] = "email or username"
        self.fields['password'].widget.attrs['placeholder'] = "password"