import { Component, Input } from '@angular/core';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-main-category',
  templateUrl: './main-category.component.html',
  styleUrls: ['./main-category.component.scss'],
})
export class MainCategoryComponent {
  @Input() catList: Category;
}
