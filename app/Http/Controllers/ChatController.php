<?php

namespace App\Http\Controllers;

use App\Events\Chat;
use App\Mail\NotificationMail;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;

class ChatController extends Controller
{

    protected $message;
    public function __construct()
    {
        $this->message = new Message;
        $this->user = new User;
    }

    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customerId' => 'required|string',
            'agentId' => 'required|string',
            'message' => 'required|string',
            'status' => 'required|string',
            'senderId' => 'required|string',
            "senderName" => "required|string",
            'customerSatisfied' => 'required | string',
            'customerEmail' => "required|string",
            'customerName' => "required|string",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->messages()->toArray(),
            ], 500);
        }

        event(
            new Chat(
                $request->input('customerId'),
                'Send Chat',
                $request->all()
            ));

        $messageSent = $this->message->create($request->all());
        if ($messageSent) {
            $responseMessage = "message sent";
            return response()->json([
                'success' => true,
                'message' => $responseMessage,
            ], 200);
        } else {
            $responseMessage = "message not sent";
            return response()->json([
                'success' => false,
                'message' => $responseMessage,
            ], 500);

        }

    }

    public function sendNotificationMail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customerName' => 'required|string',
            'customerEmail' => 'required|string',
            'title' => 'required|string',
            'mail' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->messages()->toArray(),
            ], 500);
        };

        // handle notification when the support agent answers a customer's question

        $customerName = $request->input('customerName');
        $customerEmail = $request->input('customerEmail');
        $notificationDetails = [
            'title' =>$request->input('title') ,
            'body' =>$request->input('mail'),
        ];

        \Mail::to($customerEmail)->send(new NotificationMail($notificationDetails));
        dd("Email is Sent.");

        return response()->json([
            'success' => true,
            'message' => "Email has been sent",
        ], 200);

    }

    public function getMessages(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'customerId' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'messages' => $validator->messages()->toArray(),
            ], 500);
        }
        $customerId = $request->input('customerId');
        $responseMessage = $this->message->where('customerId', $customerId)->get();
        $customerDetails = $this->user->find($customerId);

        if ($responseMessage and $customerDetails) {
            return response()->json([
                'success' => true,
                'messages' => $responseMessage,
                "customerDetails" => $customerDetails,

            ], 200);} else {

            return response()->json([
                'success' => false,
                'messages' => [],
                "customerDetails" => $customerDetails,
            ], 204);
        }

    }

    public function updateMessageStatus(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'isSatisfied' => 'required|string',
            'status' => 'required|string',
            'chatId' => 'required|string',
            "customerId" => 'required|string',
            "event" => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->messages()->toArray(),
            ], 500);
        };

        $chatId = $request->input('chatId');
        $isSatisfied = $request->input('isSatisfied');
        $customerId = $request->input('customerId');
        $status = $request->input('status');
        $updateMessage = $this->message->where('id', $chatId)->update(array('customerSatisfied' => $isSatisfied, 'status' => $status));
        if ($updateMessage == 1) {
            $responseMessage = $this->message->where('id', $chatId)->get();
            $responseMessages = $this->message->where('customerId', $customerId)->get();
            event(
                new Chat(
                    $request->input('customerId'),
                    $request->input('event'),
                    $responseMessage[0]

                ));
            return response()->json([
                'success' => true,
                'message' => $responseMessages,
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => [],
            ], 501);

        }

    }

    public function addAgentToCustomerChat(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'messageId' => 'required|string',
            'agentId' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->messages()->toArray(),
            ], 500);
        };

        $messageId = $request->input('messageId');
        $agentId = $request->input('agentId');
        $responseMessage = $this->message->where('id', $messageId)->update(array('agentId' => $agentId));

        return response()->json([
            'success' => true,
            'message' => $responseMessage,
        ], 200);

    }

}