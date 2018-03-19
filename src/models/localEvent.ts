import { Model, Table, PrimaryKey, Column, AutoIncrement, DataType } from 'sequelize-typescript'

@Table({
    timestamps: false,
    modelName: "local_event",
    tableName: "local_event",
    indexes: [{ fields: ["profile"] }]
})
export default class LocalEvent extends Model<LocalEvent> {
    @Column({ primaryKey: true })
    id: number

    @Column({ primaryKey: true })
    profile: number

    @Column
    subject: number

    @Column
    teacher: number

    @Column(DataType.BOOLEAN)
    archived: boolean

    @Column
    title: String

    @Column
    content: String

    @Column
    type: String

    @Column(DataType.BIGINT)
    completed_date: number

    @Column(DataType.BIGINT)
    day: number
}
