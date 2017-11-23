import { Model, Table, PrimaryKey, Column, AutoIncrement, DataType } from 'sequelize-typescript'

@Table({
    timestamps: false,
    modelName: "local_event",
    tableName: "local_event",
    indexes: [{ fields: ["profile"] }]
})
export default class LocalEvent extends Model<LocalEvent>{
    @PrimaryKey
    @AutoIncrement
    @Column
    fooId: number

    @Column
    id: number

    @Column
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

    @Column
    completed_date: number

    @Column
    day: number
}