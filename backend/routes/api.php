<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\SearchMessageController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['prefix' => 'users', 'middleware' => 'CORS'], function ($router) {
    Route::post('/register', [UserController::class, 'register'])->name('register.user');
    Route::post('/login', [UserController::class, 'login'])->name('login.user');
    Route::get('/user', [UserController::class, 'viewProfile'])->name('profile.user');
    Route::get('/logout', [UserController::class, 'logout'])->name('logout.user');
});

Route::group(['prefix' => 'message', 'middleware' => 'CORS'], function ($router) {
    Route::patch('/add-agentId-to-message', [ChatController::class, 'addAgentToCustomerChat']);
    Route::post('/send-notification-mail', [ChatController::class, 'sendNotificationMail']);
    Route::post('/send', [ChatController::class, 'sendMessage']);
    Route::patch('/update-status', [ChatController::class, 'updateMessageStatus']);
    Route::post('/fetch-customer-messages', [ChatController::class, 'getMessages']);

});

Route::group(['prefix' => 'customer', 'middleware' => 'CORS'], function ($router) {
    Route::post('/search-message', [SearchMessageController::class, 'searchMessage']);
    Route::get('/fetch-all-customers', [CustomersController::class, 'fetchAllCustomers']);

});