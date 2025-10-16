import { UUID } from 'crypto';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: UUID;

  @Column({ type: 'text', unique: true, nullable: false, name: 'auth_user_id' })
  authUserId!: string;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'varchar', nullable: true, name: 'last_name' })
  lastname!: string;

  @Column({ type: 'varchar', nullable: false, default: 'GRANTOR', comment: 'GRANTOR | STAFF' })
  role!: string;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate!: Date | null;

  @Column({ type: 'varchar', nullable: true })
  genre!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
