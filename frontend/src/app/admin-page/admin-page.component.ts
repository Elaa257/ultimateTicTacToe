import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { UserService } from '../profile/user.service';
import { UserDTO } from '../profile/DTOs/userDTO';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((data: UserDTO[]) => {
      this.users = data;
    });
  }

}
