<?php

use Illuminate\Support\Facades\Route;


Route::get('/', [App\Http\Controllers\InjuryController::class, 'index'])->name('home');
