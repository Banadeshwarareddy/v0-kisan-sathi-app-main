from rest_framework import viewsets, permissions
from .models import Student, Teacher, Course, Enrollment
from .serializers import StudentSerializer, TeacherSerializer, CourseSerializer, EnrollmentSerializer

class TeacherViewSet(viewsets.ModelViewSet):
    """API endpoint that allows teachers to be viewed or edited."""
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticated] # Or IsAdminUser

class CourseViewSet(viewsets.ModelViewSet):
    """API endpoint that allows courses to be viewed or edited."""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

class StudentViewSet(viewsets.ModelViewSet):
    """API endpoint that allows students to be viewed or edited."""
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

class EnrollmentViewSet(viewsets.ModelViewSet):
    """API endpoint that allows enrollments to be viewed or edited."""
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]