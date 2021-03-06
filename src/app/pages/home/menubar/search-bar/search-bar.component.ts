import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  searchText: string;
  constructor(public dataservice: DataService, private router: Router) { }

  ngOnInit() {
  }
  searchByText() {
    this.dataservice.searchByText = this.searchText;
    this.dataservice.categoryId = '1,2,3,4';
    this.router.navigate(['/advance-filter']);
  }

}
