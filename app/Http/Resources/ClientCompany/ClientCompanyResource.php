<?php

namespace App\Http\Resources\ClientCompany;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientCompanyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'address' => $this->address,
            'postal_code' => $this->postal_code,
            'city' => $this->city,
            'country' => $this->whenLoaded('country', fn () => [
                'id' => $this->country->id ?? null,
                'name' => $this->country->name ?? null,
            ]),
            'currency' => $this->whenLoaded('currency', fn () => [
                'id' => $this->currency->id ?? null,
                'name' => $this->currency->name ?? null,
            ]),
            'phone' => $this->phone,
            'web' => $this->web,
            'iban' => $this->iban,
            'swift' => $this->swift,
            'business_id' => $this->business_id,
            'tax_id' => $this->tax_id,
            'vat' => $this->vat,
            'rate' => $this->rate,
            'currency' => $this->currency,
            'clients' => $this->clients->map->only(['id', 'name']),
        ];
    }
}
