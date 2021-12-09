import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum ScanResult {
  MALICIOUS = 'MALICIOUS',
  PASSED = 'PASSED',
  NOSCAN = 'NOSCAN'
}

export type S3Status = 'inProgress' | 'finished';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  extension: string;

  @Column()
  contentType: string;

  @Column({ nullable: true })
  s3_path: string;

  @Column({ default: 'inProgress' })
  s3_status: S3Status;

  @Column()
  filesize: string;

  @Column()
  chunkCount: number;

  @Column()
  chunkSize: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  downloadCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastDownloadAt: Date;

  @Column({ nullable: true })
  maxDownloadCount: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @Column({
    type: 'enum',
    enum: ScanResult,
    default: ScanResult.NOSCAN
  })
  scan_result: ScanResult;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  last_scan_date: Date;

  @Column({
    nullable: true,
  })
  scan_detection_info: string;
}
