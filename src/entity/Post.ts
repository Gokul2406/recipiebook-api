import {BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Entity} from "typeorm"

@Entity()
export default class Post extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date

	@Column()
	ingredient: string;

	@Column()
	preparation: string;

	@Column()
	uploadedBy: string;
}
