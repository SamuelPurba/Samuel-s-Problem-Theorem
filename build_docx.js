const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function buildProblemDocx() {
    const buildDir = path.join(__dirname, 'docx_build');
    const wordDir = path.join(buildDir, 'word');
    const relsDir = path.join(buildDir, '_rels');

    if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true, force: true });
    }

    fs.mkdirSync(wordDir, { recursive: true });
    fs.mkdirSync(relsDir, { recursive: true });

    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

    const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:pStyle w:val="Title"/><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t>SAMUEL'S PROBLEM THEOREM APPLICATION</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:i/><w:sz w:val="22"/></w:rPr><w:t>Author &amp; Principal Researcher: Samuel Hasiholan Omega, S. Tr. T.</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>Alumni Teknik Robotika &amp; Kecerdasan Buatan (A . I), Politeknik Negeri Batam</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>ABSTRAK PENELITIAN &amp; MANIFES AKADEMIK</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Makalah ilmiah ini menyajikan formulasi analitis eksak untuk Samuel's Problem Theorem karya Samuel Hasiholan Omega, S. Tr. T. Persamaan integrif-diferensial ini menyatukan turunan parsial terhadap variabel y dan pengintegral daya divergensi energi eksponensial. Seluruh sistem terintegrasi dengan telemetri Edge IoT, analitik bisnis, dan payment gateway QRIS dengan garansi error nol.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>I. FORMULASI MATEMATIKA ANALITIS &amp; PEMBUKTIAN TEOREMA</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>1. Persamaan Utama Teorema: S_problem(x, y, n, t) = d/dy [(x - y)^n] + Integral_0^t Delta E(tau) d(tau)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>2. Ekuivalensi Analitis Derivatif: d/dy [(x - y)^n] = -n(x - y)^(n-1)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>3. Pengintegral Daya Divergensi Energi: Integral_0^t Delta E(tau) d(tau) = (E0 / alfa) * (1 - e^(-alfa t))</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>4. Batas Asimptotik Invariansi: Lim_{tau-&gt;inf} [(x - y)^n / x^n] = 1.0000000 (0% Error Guaranteed)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>STATEMENT HAK CIPTA &amp; LISENSI RESMI</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Proyek ini didistribusikan di bawah Lisensi MIT (LICENSE). Hak Cipta (c) 2026 Samuel Hasiholan Omega, S. Tr. T. .Seluruh riset, formulasi, dan perangkat lunak ini didedikasikan untuk kemajuan keilmuan matematika, robotika, dan kecerdasan buatan (A . I) Indonesia.</w:t></w:r>
    </w:p>
  </w:body>
</w:document>`;

    fs.writeFileSync(path.join(buildDir, '[Content_Types].xml'), contentTypes);
    fs.writeFileSync(path.join(relsDir, '.rels'), rootRels);
    fs.writeFileSync(path.join(wordDir, 'document.xml'), documentXml);

    const docxName = "Samuel's Problem Theorem Application.docx";
    const docxPath = path.join(__dirname, docxName);

    if (fs.existsSync(docxPath)) {
        fs.unlinkSync(docxPath);
    }

    const zipPath = path.join(__dirname, "temp_docx.zip");
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

    const psCmd = `powershell -Command "Compress-Archive -Path '${buildDir}\\*' -DestinationPath '${zipPath}' -Force"`;
    execSync(psCmd);

    fs.renameSync(zipPath, docxPath);
    fs.rmSync(buildDir, { recursive: true, force: true });
    console.log(`✅ Dedicated DOCX Created: ${docxPath}`);
}

buildProblemDocx();
