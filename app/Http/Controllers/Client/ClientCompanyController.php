<?php

namespace App\Http\Controllers\Client;

use App\Actions\ClientCompany\CreateClientCompany;
use App\Actions\ClientCompany\UpdateClientCompany;
use App\Http\Controllers\Controller;
use App\Http\Requests\ClientCompany\StoreClientCompanyRequest;
use App\Http\Requests\ClientCompany\UpdateClientCompanyRequest;
use App\Http\Resources\ClientCompany\ClientCompanyResource;
use App\Http\Resources\Status\CompanyStatusResource;
use App\Models\ClientCompany;
use App\Models\CompanyActivity;
use App\Models\CompanyStatus;
use App\Models\Country;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientCompanyController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(ClientCompany::class, 'company');
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Clients/Companies/Index', [
            'items' => ClientCompanyResource::collection(
                ClientCompany::searchByQueryString()
                    ->sortByQueryString()
                    ->with(['clients', 'currency', 'status'])
                    ->when($request->has('archived'), fn ($query) => $query->onlyArchived())
                    ->paginate(12)
            ),
        ]);
    }

    public function create()
    {
        $defaultCurrencyId = Currency::where('code', 'EUR')->value('id');

        return Inertia::render('Clients/Companies/Create', [
            'dropdowns' => [
                'clients' => User::clientDropdownValues(),
                'countries' => Country::dropdownValues(),
                'currencies' => Currency::dropdownValues(),
                'statuses' => CompanyStatus::select('id', 'name')->get(),
                'defaultCurrencyId' => (string) $defaultCurrencyId,
            ],
        ]);
    }

    public function store(StoreClientCompanyRequest $request)
    {
        (new CreateClientCompany)->create($request->validated());

        return redirect()->route('clients.companies.index')->success('Company created', 'A new company was successfully created.');
    }

    public function edit(ClientCompany $company)
    {
        $company->load(['status']);

        $defaultCurrencyId = Currency::where('code', 'EUR')->value('id');

        return Inertia::render('Clients/Companies/Edit', [
            'item' => new ClientCompanyResource($company),
            'dropdowns' => [
                'clients' => User::clientDropdownValues(),
                'countries' => Country::dropdownValues(),
                'currencies' => Currency::dropdownValues(),
                'statuses' => CompanyStatus::select('id', 'name')->get(),
                'defaultCurrencyId' => (string) $defaultCurrencyId,
            ],
        ]);
    }

    public function update(ClientCompany $company, UpdateClientCompanyRequest $request)
    {
        (new UpdateClientCompany)->update($company, $request->validated());

        return redirect()->route('clients.companies.index')->success('Company updated', 'The company was successfully updated.');
    }

    public function updateStatus(ClientCompany $company, Request $request)
    {
        $this->authorize('update', $company);

        $validated = $request->validate([
            'status_id' => ['required', 'exists:company_statuses,id'],
            'status_change_comment' => ['nullable', 'string', 'max:255'],
        ]);

        (new UpdateClientCompany)->update($company, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'company' => new ClientCompanyResource($company->fresh()),
        ]);
    }

    public function destroy(ClientCompany $company)
    {
        $company->archive();

        return redirect()->back()->success('Company archived', 'The company was successfully archived.');
    }

    public function restore(int $companyId)
    {
        $clientCompany = ClientCompany::withArchived()->findOrFail($companyId);

        $this->authorize('restore', $clientCompany);

        $clientCompany->unArchive();

        return redirect()->back()->success('Company restored', 'The restoring of the company was completed successfully.');
    }

    public function show(ClientCompany $company)
    {
        $this->authorize('view', $company);

        $company->load([
            'clients',
            'projects',
            'projects.activities' => fn ($query) => $query->latest()->limit(10),
            'country',
            'status',
        ]);

        $statusChanges = CompanyActivity::with(['user', 'old_status', 'new_status'])
            ->where('client_company_id', $company->id)
            ->latest()
            ->get();

        $statusChangesTransformed = $statusChanges->map(function ($change) {
            return [
                'id' => $change->id,
                'comment' => $change->comment,
                'created_at' => $change->created_at,
                'user' => $change->user ? [
                    'id' => $change->user->id,
                    'name' => $change->user->name,
                ] : null,
                'old_status' => $change->old_status
                    ? [
                        'id' => $change->old_status->id,
                        'name' => $change->old_status->name,
                        'label' => $change->old_status->name, // Add this line
                        'color' => $change->old_status->color ?? 'gray', // Add this line
                    ]
                    : null,
                'new_status' => $change->new_status
                    ? [
                        'id' => $change->new_status->id,
                        'name' => $change->new_status->name,
                        'label' => $change->new_status->name, // Add this line
                        'color' => $change->new_status->color ?? 'gray', // Add this line
                    ]
                    : null,
            ];
        });

        $activities = $company->projects
            ->flatMap(fn ($project) => $project->activities)
            ->sortByDesc('created_at')
            ->values()
            ->take(10);

        return Inertia::render('Clients/Companies/Show', [
            'item' => $company,
            'activities' => $activities->map(fn ($activity) => [
                'id' => $activity->id,
                'title' => $activity->title,
                'subtitle' => $activity->subtitle ?? null,
                'user' => $activity->user ? [
                    'id' => $activity->user->id,
                    'name' => $activity->user->name,
                ] : null,
                'created_at' => $activity->created_at,
            ]),
            'statusChanges' => $statusChangesTransformed,
        ]);
    }

    public function statusBoard()
    {
        $this->authorize('viewAny', ClientCompany::class);

        return Inertia::render('Clients/Companies/StatusBoard', [
            'statuses' => CompanyStatusResource::collection(CompanyStatus::all()),
            'companies' => ClientCompanyResource::collection(
                ClientCompany::with(['status'])->get()
            ),
        ]);
    }
}
