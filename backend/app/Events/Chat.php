<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Chat implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $customerId;
    public $event;
    public $message;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($customerId, $event, $message)
    {
        $this->customerId = $customerId;
        $this->event = $event;
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return ['chat'];
    }

    public function broadcastAs()
    {
        return 'message';
    }
}