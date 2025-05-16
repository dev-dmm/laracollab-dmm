<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Status\StoreStatusRequest;
use App\Http\Requests\Status\UpdateStatusRequest;
use App\Http\Resources\Status\CompanyStatusResource;
use App\Models\CompanyStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyStatusController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(CompanyStatus::class, 'status');
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Settings/Statuses/Index', [
            'items' => CompanyStatusResource::collection(
                CompanyStatus::searchByQueryString()
                    ->sortByQueryString()
                    ->when($request->has('archived'), fn ($query) => $query->onlyArchived())
                    ->paginate(12)
            ),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Settings/Statuses/Create');
    }

    public function store(StoreStatusRequest $request)
    {
        $validated = $request->validated();

        CompanyStatus::create($validated);

        return redirect()->route('settings.statuses.index')->success('Κατάσταση δημιουργήθηκε', 'Η νέα κατάσταση δημιουργήθηκε με επιτυχία.');
    }

    public function edit(CompanyStatus $status): Response
    {
        return Inertia::render('Settings/Statuses/Edit', [
            'item' => new CompanyStatusResource($status),
        ]);
    }

    public function update(CompanyStatus $status, UpdateStatusRequest $request)
    {
        $status->update($request->validated());

        return redirect()->route('settings.statuses.index')->success('Κατάσταση ενημερώθηκε', 'Η κατάσταση ενημερώθηκε με επιτυχία.');
    }

    public function destroy(CompanyStatus $status)
    {
        $status->archive();

        return redirect()->back()->success('Κατάσταση αρχειοθετήθηκε', 'Η κατάσταση αρχειοθετήθηκε με επιτυχία.');
    }

    public function restore(int $statusId)
    {
        $status = CompanyStatus::withArchived()->findOrFail($statusId);

        $this->authorize('restore', $status);

        $status->unArchive();

        return redirect()->back()->success('Κατάσταση επαναφέρθηκε', 'Η επαναφορά ολοκληρώθηκε με επιτυχία.');
    }
}
