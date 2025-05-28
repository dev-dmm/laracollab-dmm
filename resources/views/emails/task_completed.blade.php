@component('mail::message')
# Η εργασία ολοκληρώθηκε

Η εργασία **{{ $task->name }}** στο project **{{ $task->project->name }}** ολοκληρώθηκε.

@component('mail::button', ['url' => url("/tasks/{$task->id}")])
Δείτε την εργασία
@endcomponent

Ευχαριστούμε,<br>
{{ config('app.name') }}
@endcomponent
