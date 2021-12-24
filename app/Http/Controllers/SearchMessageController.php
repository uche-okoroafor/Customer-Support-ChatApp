<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Validator;

class SearchMessageController extends Controller
{
    public function __construct()
    {
        $this->message = new Message;
    }
    public function searchMessage(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'searchItem' => 'required|string',

        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->messages()->toArray(),
            ], 500);
        }

        if ($request->has('searchItem')) {
            $searchResult = $this->message->search($request->searchItem)
                ->paginate(6);
        } else {
            $searchResult = $this->message->paginate(6);
        }
        return response()->json([
            'success' => true,
            'message' => $searchResult,
        ], 200);

    }

}