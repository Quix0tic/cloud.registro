import { Model, Table, PrimaryKey, Column, AutoIncrement } from 'sequelize-typescript'
import { DataType } from 'sequelize-typescript/lib/enums/DataType'

@Table({
    timestamps: false,
    modelName: "remote_event_info",
    tableName: "remote_event_info",
    indexes: [{ fields: ["profile"] }]
})
export default class RemoteEventInfo extends Model<RemoteEventInfo> {
    @Column({ primaryKey: true })
    id: number

    @Column({ primaryKey: true })
    profile: number

    @Column(DataType.BOOLEAN)
    archived: boolean

    @Column(DataType.BOOLEAN)
    test: boolean

    @Column(DataType.BOOLEAN)
    completed: boolean
}
