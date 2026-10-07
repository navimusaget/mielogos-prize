document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('prize-intake-form');
  const authorsList=document.getElementById('authors-list');
  const addAuthorBtn=document.getElementById('add-author');
  const role=document.getElementById('submitter-role');
  const representativeBox=document.getElementById('representative-box');
  const translationToggle=document.getElementById('translation-toggle');
  const translatorBox=document.getElementById('translator-box');
  const category=document.getElementById('category');
  const reviewFile=document.getElementById('review-file');
  const reviewMeta=document.getElementById('review-file-meta');
  const fileRule=document.getElementById('file-rule');
  const coverImage=document.getElementById('cover-image');
  const coverAuthorityBox=document.getElementById('cover-authority-box');
  const coverMeta=document.getElementById('cover-file-meta');
  const declaration=form.elements.symbiotic_declaration;
  const declarationCount=document.getElementById('declaration-count');
  const result=document.getElementById('validation-result');

  const MiB=1024*1024;
  const textCap=10*MiB;
  const graphicCap=50*MiB;
  let authorSerial=0;

  function authorCard(){
    authorSerial++;
    const wrap=document.createElement('div');
    wrap.className='author-card';
    wrap.dataset.authorCard='true';
    wrap.innerHTML=`
      <div class="author-head"><strong>Credited author <span class="author-number"></span></strong><button type="button" class="remove-author">Remove</button></div>
      <div class="field-grid two">
        <label class="field"><span>Credited name <b>*</b></span><input data-author-field="credited_name" required maxlength="180"></label>
        <label class="field"><span>Public / pen name <span class="optional">if different</span></span><input data-author-field="public_credit_name" maxlength="180"></label>
      </div>
      <label class="checkline"><input type="checkbox" data-author-field="age_18plus_confirmed" required><span>I confirm that this credited participating human author is 18 or older. <b>*</b></span></label>`;
    wrap.querySelector('.remove-author').addEventListener('click',()=>{
      if(authorsList.children.length===1) return;
      wrap.remove();
      renumberAuthors();
    });
    return wrap;
  }

  function renumberAuthors(){
    [...authorsList.children].forEach((card,i)=>{
      card.querySelector('.author-number').textContent=String(i+1);
      card.querySelector('.remove-author').hidden=authorsList.children.length===1;
    });
  }

  function addAuthor(){ authorsList.appendChild(authorCard()); renumberAuthors(); }
  addAuthor();
  addAuthorBtn.addEventListener('click',addAuthor);
function clearFieldError(el){
if(el && el.classList) el.classList.remove(‘invalid-field’);
}

form.addEventListener(‘input’,e=>clearFieldError(e.target));
form.addEventListener(‘change’,e=>clearFieldError(e.target));
  function syncRole(){
    const isRep=role.value==='REPRESENTATIVE';
    representativeBox.hidden=!isRep;
    const cb=form.elements.representative_authority_confirm;
    cb.required=isRep;
    if(!isRep) cb.checked=false;
  }
  role.addEventListener('change',syncRole); syncRole();

  function syncTranslation(){
    translatorBox.hidden=!translationToggle.checked;
    const field=form.elements.translator_information;
    field.required=translationToggle.checked;
    if(!translationToggle.checked) field.value='';
  }
  translationToggle.addEventListener('change',syncTranslation); syncTranslation();

  function capForCategory(){ return category.value==='GRAPHIC_HYBRID_EXPERIMENTAL'?graphicCap:textCap; }
  function syncCategory(){
    if(!category.value){ fileRule.textContent='Select a category to see the applicable file limit.'; return; }
    const graphic=category.value==='GRAPHIC_HYBRID_EXPERIMENTAL';
    fileRule.textContent=graphic?'Review-copy limit for this category: 50 MB.':'Review-copy limit for this category: 10 MB.';
    syncReviewMeta();
  }
  category.addEventListener('change',syncCategory); syncCategory();

  function fmtBytes(n){ return n<MiB?`${Math.round(n/1024)} KiB`:`${(n/MiB).toFixed(2)} MiB`; }
  function syncReviewMeta(){
    const f=reviewFile.files[0];
    if(!f){reviewMeta.textContent='EPUB or PDF primary; DOCX fallback where layout is not constitutive.';return;}
    const cap=capForCategory();
    reviewMeta.textContent=`${f.name} · ${fmtBytes(f.size)} · current category limit ${Math.round(cap/MiB)} MB`;
  }
  reviewFile.addEventListener('change',syncReviewMeta);

  coverImage.addEventListener('change',()=>{
    const f=coverImage.files[0];
    coverAuthorityBox.hidden=!f;
    const cb=form.elements.cover_publicity_authority;
    cb.required=!!f;
    if(!f){cb.checked=false;coverMeta.textContent='Do not upload a cover unless you have authority for Prize publicity use.';}
    else coverMeta.textContent=`${f.name} · ${fmtBytes(f.size)} · local prototype only`;
  });

  declaration.addEventListener('input',()=>{declarationCount.textContent=String(declaration.value.length);});

  function releaseYear(value){
    const v=String(value||'').trim();
    const m=/^(\d{4})(?:-(\d{2})-(\d{2}))?$/.exec(v);
    if(!m) return null;
    if(m[2]){
      const d=new Date(`${v}T00:00:00Z`);
      if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==v) return null;
    }
    return Number(m[1]);
  }

  function extAllowed(name){ return /\.(epub|pdf|docx)$/i.test(name||''); }

  function clearInvalid(){ document.querySelectorAll('.invalid-field').forEach(el=>el.classList.remove('invalid-field')); }
  function flag(el){ if(el) el.classList.add('invalid-field'); }

  function collectErrors(){
    clearInvalid();
    const errors=[];

    [...form.querySelectorAll('[required]')].forEach(el=>{
      const empty=(el.type==='checkbox'&&!el.checked)||(el.type==='file'&&!el.files.length)||(!['checkbox','file'].includes(el.type)&&!String(el.value||'').trim());
      if(empty){ errors.push('Complete all required fields and confirmations.'); flag(el); }
      else if(el.type==='email'&&!el.validity.valid){ errors.push('Enter a valid email address.'); flag(el); }
    });

    const cards=[...authorsList.querySelectorAll('[data-author-card]')];
    if(!cards.length) errors.push('At least one credited participating human author is required.');

    const yr=releaseYear(form.elements.controlling_public_release_date_or_year.value);
    if(yr===null){errors.push('Public-release date must be YYYY or YYYY-MM-DD.');flag(form.elements.controlling_public_release_date_or_year);}
    else if(yr<2024||yr>2026){errors.push('The controlling public release must fall within 2024–2026 for the Founding Cycle.');flag(form.elements.controlling_public_release_date_or_year);}

    if(String(declaration.value||'').trim().length<40){errors.push('The Symbiotic Authorship declaration is too short to constitute a meaningful good-faith account.');flag(declaration);}

    const rf=reviewFile.files[0];
    if(rf){
      if(!extAllowed(rf.name)){errors.push('Review copy must use EPUB, PDF or DOCX for ordinary intake.');flag(reviewFile);}
      if(!category.value){errors.push('Select a category before validating the review-copy limit.');flag(category);}
      else if(rf.size>capForCategory()){errors.push(`Review copy exceeds the ${Math.round(capForCategory()/MiB)} MB limit for the selected category.`);flag(reviewFile);}
    }

    const cf=coverImage.files[0];
    if(cf&&!/^image\/(jpeg|png|webp)$/i.test(cf.type)&&!/\.(jpe?g|png|webp)$/i.test(cf.name)){errors.push('Optional cover must be JPEG, PNG or WebP.');flag(coverImage);}

    return [...new Set(errors)];
  }

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const errors=collectErrors();
    if(errors.length){
      result.className='validation-result fail';
      result.innerHTML=`<h3>Prototype validation failed</h3><p>Nothing was sent or uploaded.</p><ul>${errors.map(x=>`<li>${x}</li>`).join('')}</ul>`;
      const first=document.querySelector('.invalid-field'); if(first) first.scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
    result.className='validation-result pass';
    result.innerHTML='<h3>Prototype validation PASS</h3><p>The form is structurally complete and the selected review file passes the client-side category/size check. Nothing was sent, uploaded or reserved.</p><p><strong>Receipt status:</strong> none — this is not a submission.</p>';
    result.scrollIntoView({behavior:'smooth',block:'center'});
  });

  form.addEventListener('reset',()=>{
    setTimeout(()=>{
      authorsList.innerHTML=''; addAuthor(); syncRole(); syncTranslation(); syncCategory();
      coverAuthorityBox.hidden=true; reviewMeta.textContent='EPUB or PDF primary; DOCX fallback where layout is not constitutive.';
      coverMeta.textContent='Do not upload a cover unless you have authority for Prize publicity use.';
      declarationCount.textContent='0'; result.className='validation-result'; result.innerHTML=''; clearInvalid();
    },0);
  });
});
