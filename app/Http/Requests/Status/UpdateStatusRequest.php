<?php 

namespace App\Http\Requests\Status;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'color' => 'required|string|hex_color',
        ];
    }
}
