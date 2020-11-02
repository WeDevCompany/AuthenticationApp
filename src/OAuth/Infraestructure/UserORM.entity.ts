import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class UserORM {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() displayName: string;
  @Column() username: string;
  @Column() image: string;
  @Column() email: string;
}

export { UserORM };
