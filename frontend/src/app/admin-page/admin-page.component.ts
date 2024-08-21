import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { UserService } from '../profile/user.service';
import { UserDTO, UsersDTO } from '../profile/DTOs/userDTO';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatTabGroup,
    MatTab,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit{

  users: UserDTO[] = [];
  displayedColumns: string[] = ['id', 'nickname', 'email', 'elo', 'role'];

  currentQueue: string[] = [];
  queueColumns: string[] = ['currentQueue'];

  constructor(private userService: UserService, private adminService: AdminService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((data: UsersDTO) => {
      this.users = data.users || [];
      console.log('Message:', data.message);
      console.log('Users:', this.users);
    });

    this.adminService.getCurrentQueue().subscribe((data: string[]) => {
      this.currentQueue = data || [];
    });
  }


}
