import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { File } from '../../file/entities/file.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @OneToMany(() => File, (file) => file.id)
  file: File[];

  @Column('boolean', { default: false })
  suspended: string;

  @Column({ type: 'timestamp', nullable: true })
  suspendedAt: Date;

  @Column('text', { nullable: true })
  suspensionReason: string;
}
