import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class UserORM {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() displayName: string;
  @Column() username: string;
  @Column() image: string;
  @Column() email: string;
  @Column() provider: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) createAt: string;
  @Column({ type: 'timestamp', nullable: true }) deleteAt;
}

export { UserORM };
