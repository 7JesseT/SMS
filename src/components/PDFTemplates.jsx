import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: '2px solid #D4AF37',
    paddingBottom: 15,
  },
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A67C00',
    marginBottom: 5,
  },
  schoolMotto: {
    fontSize: 11,
    color: '#666666',
    fontStyle: 'italic',
  },
  studentIdCard: {
    marginTop: 20,
    border: '2px solid #D4AF37',
    padding: 20,
    borderRadius: 8,
  },
  cardSection: {
    marginBottom: 15,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    border: '2px solid #D4AF37',
  },
  studentInfo: {
    flex: 1,
    fontSize: 11,
    color: '#333333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    color: '#A67C00',
  },
  value: {
    flex: 1,
    color: '#333333',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 9,
    color: '#666666',
    borderTop: '1px solid #D4AF37',
    paddingTop: 15,
  },
});

/**
 * Student ID Card PDF component
 */
export const StudentIDCard = ({ student }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.schoolName}>The Heart of Our Father School</Text>
          <Text style={styles.schoolMotto}>Excellence in Education, Excellence in Character</Text>
        </View>

        <View style={styles.studentIdCard}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 15, color: '#A67C00' }}>
            STUDENT IDENTIFICATION CARD
          </Text>

          <View style={styles.cardSection}>
            <Image src={student.photo} style={styles.photo} />
            <View style={styles.studentInfo}>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>
                  {student.firstName} {student.lastName}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Student ID:</Text>
                <Text style={styles.value}>{student.id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Admission No:</Text>
                <Text style={styles.value}>{student.admissionNo}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Class:</Text>
                <Text style={styles.value}>{student.class}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Gender:</Text>
                <Text style={styles.value}>{student.gender}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Guardian:</Text>
                <Text style={styles.value}>{student.guardian.name}</Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20, fontSize: 9, color: '#666666' }}>
            <Text>This card is the property of The Heart of Our Father School.</Text>
            <Text>It should be carried at all times. In case of loss, report immediately to the Student Affairs office.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Issued by: The Heart of Our Father School</Text>
          <Text>Valid for the current academic session</Text>
        </View>
      </Page>
    </Document>
  );
};

/**
 * Attendance Report PDF component
 */
export const AttendanceReportPDF = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.schoolName}>The Heart of Our Father School</Text>
          <Text style={styles.schoolMotto}>Attendance Report</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Report Period:</Text>
            <Text style={styles.value}>Academic Year 2025/2026</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Generated:</Text>
            <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10, color: '#A67C00' }}>
            Monthly Attendance Summary
          </Text>
          {data?.map((item) => (
            <View key={item.month} style={styles.row}>
              <Text style={{ width: 80, color: '#333333' }}>{item.month}</Text>
              <Text style={{ flex: 1, color: '#666666' }}>
                {'█'.repeat(Math.floor(item.percentage / 10))} {item.percentage}%
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>This is an official document from The Heart of Our Father School.</Text>
        </View>
      </Page>
    </Document>
  );
};
