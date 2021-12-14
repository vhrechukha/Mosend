import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { File } from '../../file/entities/file.entity';

export enum ReportStatus {
  NOT_REVIEWED = 'NOT_REVIEWED',
  REVIEWED_NOT_MALICIOUS = 'REVIEWED_NOT_MALICIOUS',
  REVIEWED_MALICIOUS = 'REVIEWED_MALICIOUS',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    message: string;

  @Column()
    ip: string;

  @ManyToOne(() => File, (file) => file.id)
  @JoinColumn({ name: 'file_id' })
    file: File;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.NOT_REVIEWED,
  })
    status: ReportStatus;

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
