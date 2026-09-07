# Alzheimer EEG-Group Randomization API

**Local base URL:** `http://localhost:10000/api`

## Session flow

1. `POST /sessions/start` creates or returns a patient session.
2. `POST /sessions/:id/inclusion` saves inclusion screening.
3. `POST /sessions/:id/exclusion` saves exclusion screening.
4. `POST /sessions/:id/pause` and `POST /sessions/:id/resume` preserve an unfinished session.
5. `POST /sessions/:id/randomize` saves the doctor-selected EEG group and assigns the next code from its list.

### Randomize

```json
{
  "eegGroup": "SEA"
}
```

Allowed groups are `SEA` and `NO_SEA`. The response contains only the allocation code, `A` or `B`.

The server returns the same allocation for a previously randomized session. It returns `409` when the patient has not passed exclusion screening or when the selected group’s 34-row allocation list is exhausted.

## Dashboard

`GET /admin/dashboard` returns randomized totals for codes A/B, EEG groups SEA/No SEA, screening status counts, and session records.
