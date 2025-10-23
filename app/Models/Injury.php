<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Injury extends Model
{
    protected $connection = 'mongodb';
    protected $table = 'injuries';
    protected $fillable = [
        'title',
        'body',
        'created_at',
    ];

}
