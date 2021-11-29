import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  timestamp: Date;

  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;
}
