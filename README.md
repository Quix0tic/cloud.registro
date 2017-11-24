# cloud.registro

Nothing gets removed. Everything gets upserted

### GET /v1/user/:profile/local
*returns*: [LocalEvent[]](#localevent)
### GET /v1/user/:profile/remote
*returns*: [RemoteEventInfo[]](#remoteeventinfo)
### POST /v1/user/:profile/local
*body*: [LocalEvent[]](#localevent)
### POST /v1/user/:profile/remote
*body*: [RemoteEventInfo[]](#remoteeventinfo)


### LocalEvent
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

### RemoteEventInfo
```typescript
class RemoteEventInfo{
    id: number
    archived: boolean
    test: boolean
    completed: boolean
}
```
