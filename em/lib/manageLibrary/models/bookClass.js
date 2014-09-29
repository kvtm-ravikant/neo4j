/**
 * Created by ravikant on 16/9/14.
 */


function ParentBook(){
    this.bindingType="";
    this.bookTitle="";
    this.categoryName="";
    this.bibLevel="";
    this.edition=0;
    this.bookCopies=0;
    this.language="";
    this.publisher="";
    this.isbn="";
    this.coverImagePath="";
    this.authorName="";
    this.docType="";
    this.softDelete="";
    this._id="";

}
function ChildBook(){
    this.bookId="";
    this.bookStatus="";
    this.freqReminder="";
    this.outletName="";
    this.currencyType="";
    this.softDelete=false;
    this.location="";
    this.purchaseDate="";
    this.publicationDate="";
    this.starRating=0;
    this.pricePaid="";
    this.frequency="";
    this.barCode="";
    this.description="";
    this.tag="";
    this.materialAccompanied="";
    this.updatedDate="";
    this.createdDate="";
    this._id="";
}

function CompleteBook(parentBook,childBooks){
    this.parentbook=parentBook?parentBook:null;
    this.children=[];
    this.isChildOpen=false;
    this.addChildBook=function(childBook){
        this.children.push(childBook);
    }
    if(childBooks && (childBooks instanceof Array)){
        this.children=this.children.concat(childBooks)
    }
    childBooks?this.children.push(childBooks):null;
}

module.exports.ParentBook=ParentBook;
module.exports.ChildBook=ChildBook;
module.exports.CompleteBook=CompleteBook;