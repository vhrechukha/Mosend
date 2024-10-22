import {
  Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { File } from '../../file/entities/file.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column('text')
    name: string;

  @Column('text')
    email: string;

  @Column('int', { default: 24000 })
    f_size_max: number;

  @Column('int', { default: 5 })
    f_count_max: number;

  @Column('text')
  @Exclude({ toPlainOnly: true })
    password: string;

  @OneToMany(() => File, (file) => file.id)
    file: File[];

  @Column('boolean', { default: false })
    suspended: string;

  @Column({ type: 'timestamp', nullable: true })
    suspended_at: Date;

  @Column('text', { nullable: true })
    suspension_reason: string;

  @Column('boolean', { nullable: false, default: false })
    is_verified: boolean;

  @Column({ type: 'timestamp', nullable: true })
    verified_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
    created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
    updated_at: Date;
}
