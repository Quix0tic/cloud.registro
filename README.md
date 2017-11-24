# cloud.registro

Nothing gets removed. Everything gets upserted.

## Sensitive data
Create `sensitive.ts` within `src` folder before building the container.
```typescript
export const POSTGRES_DATABASE = "xxxxxxxx"
export const POSTGRES_PASSWORD = "xxxxxxxx" 
export const POSTGRES_USERNAME = "xxxxxxxx"
export const POSTGRES_HOST = "192.168.x.x"
```

## GET /v1/user/:profile/local
*returns*: [LocalEvent[]](#localevent)
## GET /v1/user/:profile/remote
*returns*: [RemoteEventInfo[]](#remoteeventinfo)
## POST /v1/user/:profile/local
*body*: [LocalEvent[]](#localevent)
## POST /v1/user/:profile/remote
*body*: [RemoteEventInfo[]](#remoteeventinfo)


## LocalEvent
```typescript
class LocalEvent{
    id: number
    subject: number
    teacher: number
    archived: boolean
    title: String
    content: String
    type: String
    completed_date: number
    day: number
}
```

## RemoteEventInfo
```typescript
class RemoteEventInfo{
    id: number
    archived: boolean
    test: boolean
    completed: boolean
}
```
