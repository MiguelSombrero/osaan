# GetSkillsResponse

Paginated response containing skills and pagination metadata

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**skills** | [**Array&lt;Skill&gt;**](Skill.md) |  | [optional] [default to undefined]
**page** | **number** | Current page number (zero-based) | [optional] [default to undefined]
**size** | **number** | Number of items per page | [optional] [default to undefined]
**totalElements** | **number** | Total number of items | [optional] [default to undefined]
**totalPages** | **number** | Total number of pages | [optional] [default to undefined]
**first** | **boolean** | Whether this is the first page | [optional] [default to undefined]
**last** | **boolean** | Whether this is the last page | [optional] [default to undefined]

## Example

```typescript
import { GetSkillsResponse } from './api';

const instance: GetSkillsResponse = {
    skills,
    page,
    size,
    totalElements,
    totalPages,
    first,
    last,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
