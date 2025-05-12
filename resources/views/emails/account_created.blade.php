<x-mail::message>
# {{ $notifiable->getFirstName() }}, welcome aboard!

An account has been set up for you by the administrator.  
You can click the button below to log in with the provided password.  
It might be a good idea to change the password when you login.

**Password:** `{{ $password }}`

<x-mail::button :url="$loginUrl">
Login
</x-mail::button>

See you soon!  
{{ config('app.name') }}
</x-mail::message>
