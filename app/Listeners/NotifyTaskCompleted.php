<?php

// app/Listeners/NotifyTaskCompleted.php

namespace App\Listeners;

use App\Events\Task\TaskCompleted;
use App\Notifications\TaskCompletedNotification;

class NotifyTaskCompleted
{
    public function handle(TaskCompleted $event): void
    {
        $event->task->subscribedUsers
            ->reject(fn ($user) => $user->id === auth()->id())
            ->each(fn ($user) => $user->notify(new TaskCompletedNotification($event->task)));
    }
}
