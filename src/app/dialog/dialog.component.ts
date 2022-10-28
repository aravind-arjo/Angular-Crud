import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshlist = ["BrandNew","Second Hand","Refurbished"];
  actionbtn : string = "Save";
  productForm ! : FormGroup

  constructor( private formBuilder : FormBuilder, private api : ApiService,
      @Inject(MAT_DIALOG_DATA) public editData : any,
    //  @inject(MAT_DIALOG_DATA) public editdata :any,
      private dialogref : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName : ['', Validators.required],
      category : ['', Validators.required],
      freshness : ['', Validators.required],
      price : ['', Validators.required],
      comments : ['', Validators.required],
      date : ['', Validators.required],
    });
    if(this.editData){
      this.actionbtn="Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comments'].setValue(this.editData.comments);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addproduct(){
    if (!this.editData) {
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:()=>{
            alert("Product added successfully!")
            this.productForm.reset();
            this.dialogref.close('save');
          },
          error: () =>{
            alert("Error while adding product!")
          }
        }) 
      }
    } else {
this.updateproduct();
    }
  
  }

  updateproduct(){
    this.api.putproduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("product Added Succesfully");
        this.productForm.reset();
        this.dialogref.close('update');
      },
      error:()=>{
        alert("Oops something went wrong");
      }
    })
  }
}
