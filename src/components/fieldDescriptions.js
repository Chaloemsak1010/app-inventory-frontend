export const fieldDescriptions = {

  core_application: `
Core Application
หมายถึงระบบที่มีผลกระทบโดยตรงต่อ:

• การดำเนินธุรกิจ
• รายได้หรือการเงินของบริษัท
• ภาพลักษณ์ขององค์กร
• ใช้กับพนักงานทั้งองค์กร และเกี่ยวข้องกับเรื่องเงิน

ดังนั้นทุกระบบที่เป็น Core Application
จะต้องมี Critical Level อยู่ในระดับ
High (H) หรือ Very High (VH) เท่านั้น
`,

  criticality_level: `
Critical Level คือระดับความสำคัญของระบบ

VH (Very High)
ระบบที่ต้องเป็น Core Application และมีผลกระทบสูงสุดต่อ
• ธุรกิจ
• การเงิน
• ภาพลักษณ์องค์กร
• จำนวนผู้ใช้งาน

H (High)
ธุรกิจพึ่งพาระบบนี้ หากระบบล่มต้องกู้คืนทันที

M (Medium)
กระทบธุรกิจแต่ยังสามารถดำเนินงานต่อได้
ภายในระยะเวลา 1–3 วัน

L (Low)
ไม่มีผลกระทบโดยตรงต่อธุรกิจ
แต่มีผู้ใช้งานจำนวนมาก

VL (Very Low)
ระบบที่ใช้โดยพนักงานจำนวนน้อย
เพื่อเพิ่มประสิทธิภาพในการทำงาน
และมีทางเลือกหรือ workaround หากระบบล่ม
`,

  business_owner: `
Business Owner

Key business user ที่ให้ requirement
หรือเป็นผู้ใช้งานหลัก (Key User)
ของระบบนั้น
`,

  data_owner: `
Data Owner

ผู้มีอำนาจอนุมัติหากต้องการนำข้อมูลไปใช้งาน

รวมถึงต้องรับทราบหากเกิดเหตุการณ์
ข้อมูลรั่วไหลหรือข้อมูลถูกเข้าถึงโดยไม่ได้รับอนุญาต
`,

  system_owner: `
System Owner

เจ้าหน้าที่ IT ที่ดูแลระบบ

เมื่อพบปัญหาจะสามารถ
• วิเคราะห์ปัญหา
• อธิบายโครงสร้างระบบ
• ประสานงานแก้ไขปัญหาได้
`,

  authentication_method: `
Authentication Method

SAP
- SAP Authentication

AD
- Login ผ่าน LDAP หรือ Kerberos

O365
- Login ผ่าน Microsoft O365
- การควบคุม MFA อาจดำเนินการโดย CBS Team

Azure AD
- Application เชื่อมต่อ Login ผ่าน Azure AD
- MFA อาจถูกควบคุมโดย CBS Team

Local
- Application เก็บ Username / Password เอง

Local + MFA
- Application เก็บ Username / Password เอง
- และมีการทำ Multi-Factor Authentication
`,

  application_category: `
Application Categories

Business Application
- SAP
- ERP
- Web Application
- Power App ที่สนับสนุนการทำงานขององค์กร
เช่น Travel & Expense

End User Application
- Power App ที่ไม่ได้ support business หลัก
เช่น KPI App

Infrastructure Application
- SFTP
- Data Gateway

Security Application
- Firewall tools
- Security scanning tools

Developer Tools / Tools
- API Gateway
- Source Control

Channels
- Application ที่ support Social เช่น
Line, Facebook เป็นต้น
`
};