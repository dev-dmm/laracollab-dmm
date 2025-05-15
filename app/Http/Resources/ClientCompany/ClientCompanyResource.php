<?php

namespace App\Http\Resources\ClientCompany;

use Illuminate\Http\Resources\Json\JsonResource;

class ClientCompanyResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'email'        => $this->email,
            'phone'        => $this->phone,
            'address'      => $this->address,
            'city'         => $this->city,
            'postal_code'  => $this->postal_code,
            'country'      => $this->whenLoaded('country'),
            'business_id'  => $this->business_id,
            'vat'          => $this->vat,
            'clients'      => $this->whenLoaded('clients', fn () => $this->clients->map(fn ($client) => [
                'id'    => $client->id,
                'name'  => $client->name,
                'email' => $client->email,
                'phone' => $client->phone,
            ]), []),

            'projects'     => $this->whenLoaded('projects', fn () => $this->projects->map(fn ($project) => [
                'id'         => $project->id,
                'name'       => $project->name,
                'created_at' => $project->created_at,
            ]), []),

            'activities'   => $this->whenLoaded('activities', fn () => $this->activities->map(fn ($activity) => [
                'id'         => $activity->id,
                'title'      => $activity->title,
                'subtitle'   => $activity->subtitle,
                'created_at' => $activity->created_at,
            ]), []),
        ];
    }
}
