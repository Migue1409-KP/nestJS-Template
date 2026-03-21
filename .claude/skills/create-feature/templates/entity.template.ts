import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

/**
 * {ENTITY_NAME} Entity
 * 
 * Represents a {ENTITY_DESCRIPTION}
 */
@Entity('{TABLE_NAME}')
export class {ENTITY_CLASS} {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  {COLUMNS}

  {RELATIONS}

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
