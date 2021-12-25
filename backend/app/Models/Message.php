<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Message extends Model
{
    use HasFactory;use Searchable;

    protected $fillable = [
        'customerId',
        'agentId',
        'message',
        'status',
        'senderId',
        'customerSatisfied',
        'customerName',
        'customerEmail',
        "senderName",
    ];
    protected $primaryKey = 'customerId';
    public function user()
    {

        return $this->belongsTo('App\User');

    }
    public function searchableAs()
    {
        return 'messages_index';
    }
}