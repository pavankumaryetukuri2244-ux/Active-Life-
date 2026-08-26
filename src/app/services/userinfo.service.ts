import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {
  public userdetails = new BehaviorSubject<any>([]);
  userinfo: {}[];
  constructor() {
    this.userinfo = [
     {
      name: 'John Deo',
      email: 'John@Deo.com',
      image: 'assets/images/user.jpg'
     }
    ];
    this.setUser(this.userinfo);
  }
  setUser(value: {}[]) {
    this.userdetails.next(value);
  }

  BindTable(name: any) {
    const t = $(name).DataTable({
      scrollY: '60vh',
      scrollX: true,
      scrollCollapse: true,
      ordering: true,
      dom: 'lBfrtip',
      lengthMenu: [
        [5,10, 40, 50, -1],
        ['5', '10','20', '40', '50', 'All']
      ],
      buttons: [
        {
          extend: 'copy',
          text: 'Copy',
          title: ''
        },
        {
          extend: 'csvHtml5',
          text: 'CSV',
          title: ''
        },
        {
          extend: 'excelHtml5',
          text: 'Excel',
          title: ''
        },
        {
          extend: 'pdfHtml5',
          text: 'PDF',
          title: ''
        }
      ],
      responsive: true,
      stateSave: true,
      'columnDefs': [{
        'searchable': false,
        'orderable': false,
        'targets': 0
      }],
      'order': [[1, 'asc']],

      'language': {
        'lengthMenu': 'show _MENU_ records',
        'search': '',
        'searchPlaceholder': ' Search here..'
      }
    });

    t.on('order.dt search.dt', function () {
      t.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell: { innerHTML: any; }, i: number) {
        cell.innerHTML = i + 1;
      });
    }).draw();
  }

}
