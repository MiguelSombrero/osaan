# AdminSkillsApi

All URIs are relative to *http://localhost:8092*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createSkill**](#createskill) | **POST** /v1/admin/skills | Create Skill|
|[**deleteSkill**](#deleteskill) | **DELETE** /v1/admin/skills/{skillId} | Delete skill|
|[**getSkills**](#getskills) | **GET** /v1/admin/skills | Get skills|

# **createSkill**
> Skill createSkill(skill)

Creates new skill and returns created skill with generated ID.

### Example

```typescript
import {
    AdminSkillsApi,
    Configuration,
    Skill
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSkillsApi(configuration);

let skill: Skill; //

const { status, data } = await apiInstance.createSkill(
    skill
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **skill** | **Skill**|  | |


### Return type

**Skill**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteSkill**
> Skill deleteSkill()

Delete skill by ID

### Example

```typescript
import {
    AdminSkillsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSkillsApi(configuration);

let skillId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteSkill(
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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |
|**204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSkills**
> Array<Skill> getSkills()

Get all skills.

### Example

```typescript
import {
    AdminSkillsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSkillsApi(configuration);

const { status, data } = await apiInstance.getSkills();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Skill>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

