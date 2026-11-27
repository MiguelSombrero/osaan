# PublicSkillsApi

All URIs are relative to *http://localhost:8092*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getSkill**](#getskill) | **GET** /v1/skills/{skillId} | Get skill|
|[**getSkills**](#getskills) | **GET** /v1/skills | Get skills|

# **getSkill**
> Skill getSkill()

Get skill by ID

### Example

```typescript
import {
    PublicSkillsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicSkillsApi(configuration);

let skillId: string; // (default to undefined)

const { status, data } = await apiInstance.getSkill(
    skillId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **skillId** | [**string**] |  | defaults to undefined|


### Return type

**Skill**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSkills**
> GetSkillsResponse getSkills()

Get all skills with pagination support. Use \'page\' (zero-based), \'size\', and \'sort\' query parameters.

### Example

```typescript
import {
    PublicSkillsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicSkillsApi(configuration);

let query: string; //Filter skills by name (case-insensitive, partial match). (optional) (default to undefined)
let page: number; //Zero-based page index (0..N) (optional) (default to 0)
let size: number; //The size of the page to be returned (optional) (default to 20)
let sort: Array<string>; //Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. (optional) (default to undefined)

const { status, data } = await apiInstance.getSkills(
    query,
    page,
    size,
    sort
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **query** | [**string**] | Filter skills by name (case-insensitive, partial match). | (optional) defaults to undefined|
| **page** | [**number**] | Zero-based page index (0..N) | (optional) defaults to 0|
| **size** | [**number**] | The size of the page to be returned | (optional) defaults to 20|
| **sort** | **Array&lt;string&gt;** | Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. | (optional) defaults to undefined|


### Return type

**GetSkillsResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

